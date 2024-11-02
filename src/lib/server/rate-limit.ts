export class TokenBucket<T> {
	max: number;
	refillIntervalSeconds: number;

	#storage = new Map<T, Bucket>();

	constructor(max: number, refillIntervalSeconds: number) {
		this.max = max;
		this.refillIntervalSeconds = refillIntervalSeconds;
	}

	check(key: T, cost: number): boolean {
		const bucket = this.#storage.get(key);
		if (bucket === undefined) return true;

		const now = Date.now();
		const refill = Math.floor((now - bucket.refilledAt) / (this.refillIntervalSeconds * 1000));

		if (refill > 0) return Math.min(bucket.count + refill, this.max) >= cost;
		return bucket.count >= cost;
	}

	consume(key: T, cost: number): boolean {
		let bucket = this.#storage.get(key);
		const now = Date.now();
		if (bucket === undefined) {
			bucket = {
				count: this.max - cost,
				refilledAt: now
			};
			this.#storage.set(key, bucket);
			return true;
		}
		const refill = Math.floor((now - bucket.refilledAt) / (this.refillIntervalSeconds * 1000));
		if (refill > 0) {
			bucket.count = Math.min(bucket.count + refill, this.max);
			bucket.refilledAt = now;
		}
		if (bucket.count < cost) {
			this.#storage.set(key, bucket);
			return false;
		}
		bucket.count -= cost;
		this.#storage.set(key, bucket);
		return true;
	}
}
interface Bucket {
	count: number;
	refilledAt: number;
}
