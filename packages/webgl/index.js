// Core
import { Geometry } from './src/core/Geometry.js';
import { Program } from './src/core/Program.js';
import { Renderer } from './src/core/Renderer.js';
import { Camera } from './src/core/Camera.js';
import { Transform } from './src/core/Transform.js';
import { Mesh } from './src/core/Mesh.js';
import { Texture } from './src/core/Texture.js';
import { RenderTarget } from './src/core/RenderTarget.js';

// Maths
import { Color } from './src/maths/Color.js';
import { Euler } from './src/maths/Euler.js';
import { Mat3 } from './src/maths/Mat3.js';
import { Mat4 } from './src/maths/Mat4.js';
import { Quat } from './src/maths/Quat.js';
import { Vec2 } from './src/maths/Vec2.js';
import { Vec3 } from './src/maths/Vec3.js';
import { Vec4 } from './src/maths/Vec4.js';

// Geometries
import { Plane } from './src/geometries/Plane.js';
import { Box } from './src/geometries/Box.js';
import { Sphere } from './src/geometries/Sphere.js';
import { Cylinder } from './src/geometries/Cylinder.js';
import { Triangle } from './src/geometries/Triangle.js';
import { Torus } from './src/geometries/Torus.js';

// Extras
import { Orbit } from './src/extras/Orbit.js';
import { Raycast } from './src/extras/Raycast.js';
import { Curve } from './src/extras/Curve.js';
import { Path } from './src/extras/Path/Path.js';
import { Post } from './src/extras/Post.js';
import { Skin } from './src/extras/Skin.js';
import { Animation } from './src/extras/Animation.js';
import { Text } from './src/extras/Text.js';
import { NormalProgram } from './src/extras/NormalProgram.js';
import { Flowmap } from './src/extras/Flowmap.js';
import { GPGPU } from './src/extras/GPGPU.js';
import { Polyline } from './src/extras/Polyline.js';
import { Shadow } from './src/extras/Shadow.js';
import { KTXTexture } from './src/extras/KTXTexture.js';
import { TextureLoader } from './src/extras/TextureLoader.js';
import { GLTFLoader } from './src/extras/GLTFLoader.js';
import { GLTFSkin } from './src/extras/GLTFSkin.js';
import { BasisManager } from './src/extras/BasisManager.js';
import { WireMesh } from './src/extras/WireMesh.js';
import { AxesHelper } from './src/extras/helpers/AxesHelper.js';
import { GridHelper } from './src/extras/helpers/GridHelper.js';
import { VertexNormalsHelper } from './src/extras/helpers/VertexNormalsHelper.js';
import { FaceNormalsHelper } from './src/extras/helpers/FaceNormalsHelper.js';
import { InstancedMesh } from './src/extras/InstancedMesh.js';

const OGL = {};

OGL.Geometry = Geometry;
OGL.Program = Program;
OGL.Renderer = Renderer;
OGL.Camera = Camera;
OGL.Transform = Transform;
OGL.Mesh = Mesh;
OGL.Texture = Texture;
OGL.RenderTarget = RenderTarget;
OGL.Color = Color;
OGL.Euler = Euler;
OGL.Mat3 = Mat3;
OGL.Mat4 = Mat4;
OGL.Quat = Quat;
OGL.Vec2 = Vec2;
OGL.Vec3 = Vec3;
OGL.Vec4 = Vec4;
OGL.Plane = Plane;
OGL.Box = Box;
OGL.Sphere = Sphere;
OGL.Cylinder = Cylinder;
OGL.Triangle = Triangle;
OGL.Torus = Torus;
OGL.Orbit = Orbit;
OGL.Raycast = Raycast;
OGL.Curve = Curve;
OGL.Path = Path;
OGL.Post = Post;
OGL.Skin = Skin;
OGL.Animation = Animation;
OGL.Text = Text;
OGL.NormalProgram = NormalProgram;
OGL.Flowmap = Flowmap;
OGL.GPGPU = GPGPU;
OGL.Polyline = Polyline;
OGL.Shadow = Shadow;
OGL.KTXTexture = KTXTexture;
OGL.TextureLoader = TextureLoader;
OGL.GLTFLoader = GLTFLoader;
OGL.GLTFSkin = GLTFSkin;
OGL.BasisManager = BasisManager;
OGL.WireMesh = WireMesh;
OGL.AxesHelper = AxesHelper;
OGL.GridHelper = GridHelper;
OGL.VertexNormalsHelper = VertexNormalsHelper;
OGL.FaceNormalsHelper = FaceNormalsHelper;
OGL.InstancedMesh = InstancedMesh;

export default OGL;
export { OGL };
export {
	Geometry,
	Program,
	Renderer,
	Camera,
	Transform,
	Mesh,
	Texture,
	RenderTarget,
	Color,
	Euler,
	Mat3,
	Mat4,
	Quat,
	Vec2,
	Vec3,
	Vec4,
	Plane,
	Box,
	Sphere,
	Cylinder,
	Triangle,
	Torus,
	Orbit,
	Raycast,
	Curve,
	Path,
	Post,
	Skin,
	Animation,
	Text,
	NormalProgram,
	Flowmap,
	GPGPU,
	Polyline,
	Shadow,
	KTXTexture,
	TextureLoader,
	GLTFLoader,
	GLTFSkin,
	BasisManager,
	WireMesh,
	AxesHelper,
	GridHelper,
	VertexNormalsHelper,
	FaceNormalsHelper,
	InstancedMesh,
};
