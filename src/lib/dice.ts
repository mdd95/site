import { ColliderDesc, init, RigidBody, RigidBodyDesc, World } from '@dimforge/rapier3d-compat';
import {
	AmbientLight,
	Color,
	DirectionalLight,
	Fog,
	Group,
	Mesh,
	MeshStandardMaterial,
	PerspectiveCamera,
	PlaneGeometry,
	Scene,
	WebGLRenderer
} from 'three';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import DiceModel from '$lib/assets/3d/dice.glb?url';

export class MainScene {
	renderer: WebGLRenderer;
	scene: Scene;
	camera: PerspectiveCamera;

	gravity = { x: 0, y: -9.81, z: 0 };
	world: World | undefined;

	dracoLoader: DRACOLoader;
	gltfLoader: GLTFLoader;

	models: Map<string, Group | Mesh> = new Map();
	objects: Map<string, { mesh: Group | Mesh; body: RigidBody }> = new Map();

	constructor(root: HTMLElement, width: number, height: number) {
		this.renderer = new WebGLRenderer({
			antialias: true
		});
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(width, height);
		this.renderer.shadowMap.enabled = true;
		root.appendChild(this.renderer.domElement);

		this.scene = new Scene();
		this.scene.background = new Color(0x000000);
		this.scene.fog = new Fog(0x000000, 0, 10);

		this.camera = new PerspectiveCamera(50, width / height, 0.1, 100);
		this.camera.position.set(2.5, 1.0, -2.5);
		this.camera.lookAt(0, 0, 0);

		const ambientLight = new AmbientLight(0xffffff, 0.5);
		this.scene.add(ambientLight);

		const backlight = new DirectionalLight(0xffffff, 1);
		backlight.position.set(0, 1.2, -0.8);
		backlight.castShadow = true;
		backlight.shadow.mapSize.width = 2048;
		backlight.shadow.mapSize.height = 2048;
		this.scene.add(backlight);

		const controls = new OrbitControls(this.camera, this.renderer.domElement);
		controls.maxPolarAngle = Math.PI / 2 - 0.1;

		const groundGeom = new PlaneGeometry(100, 100).rotateX(-Math.PI / 2);
		const groundMat = new MeshStandardMaterial({
			color: 0xffffff,
			roughness: 0.5,
			metalness: 1
		});
		const groundMesh = new Mesh(groundGeom, groundMat);
		groundMesh.receiveShadow = true;
		this.scene.add(groundMesh);

		this.dracoLoader = new DRACOLoader();
		this.dracoLoader.setDecoderPath('/draco/');
		this.dracoLoader.preload();

		this.gltfLoader = new GLTFLoader();
		this.gltfLoader.setDRACOLoader(this.dracoLoader);

		Promise.all([this.loadModel('dice', DiceModel), this.initPhysics()]).then(() => {
			this.createObject();
		});
	}

	setRendererSize(width: number, height: number) {
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(width, height);
	}

	destroy() {
		this.models.clear();
		this.renderer.dispose();
	}

	async initPhysics() {
		await init();

		this.world = new World(this.gravity);

		const groundColliderDesc = ColliderDesc.cuboid(10, 0.5, 10)
			.setTranslation(0, -0.5, 0)
			.setFriction(0.5)
			.setRestitution(0.75);
		this.world.createCollider(groundColliderDesc);

		const update = () => {
			this.world!.step();
			this.objects.forEach((obj) => {
				obj.mesh.position.copy(obj.body.translation());
				obj.mesh.quaternion.copy(obj.body.rotation());
			});

			requestAnimationFrame(update);
		};
		requestAnimationFrame(update);
		this.renderer.setAnimationLoop(this.animate.bind(this));
	}

	loadModel(name: string, path: string): Promise<void> {
		return new Promise((resolve, reject) => {
			if (this.models.has(name)) reject(`Model ${name} already loaded`);

			this.gltfLoader.load(path, (gltf) => {
				const model = gltf.scene;
				model.scale.set(0.1, 0.1, 0.1);
				model.traverse((child) => {
					if (child instanceof Mesh) child.castShadow = true;
				});

				this.models.set(name, model);
				resolve();
			});
		});
	}

	newModel(name: string) {
		if (!this.models.has(name)) return;

		const model = this.models.get(name)!.clone();
		model.position.set(0, 0, 0);

		this.scene.add(model);
		return model;
	}

	newBody() {
		if (this.world === undefined) return;

		const rigidBodyDesc = RigidBodyDesc.dynamic()
			.setTranslation(0, 1, 0)
			.setLinvel(1 + Math.random(), 0, 0)
			.setAngvel({
				x: Math.random() * 2,
				y: Math.random() * 2,
				z: Math.random() * 2
			});

		const rigidBody = this.world.createRigidBody(rigidBodyDesc);
		const colliderDesc = ColliderDesc.cuboid(0.1, 0.1, 0.1).setMass(0.1);
		this.world.createCollider(colliderDesc, rigidBody);
		return rigidBody;
	}

	createObject() {
		if (this.world === undefined) return;
		const model = this.newModel('dice')!;
		const body = this.newBody()!;
		this.objects.set('dice', { mesh: model, body });
	}

	animate() {
		this.renderer.render(this.scene, this.camera);
	}

	roll() {
		this.objects.forEach((obj) => {
			obj.body.setTranslation({ x: 0, y: 1, z: 0 }, true);
			obj.body.setLinvel({ x: 1 + Math.random(), y: 0, z: 0 }, true);
			obj.body.setAngvel(
				{ x: Math.random() * 2, y: Math.random() * 2, z: Math.random() * 2 },
				true
			);
		});
	}
}
