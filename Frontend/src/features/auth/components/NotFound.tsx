import { Link } from "react-router-dom";
import RippleGrid from "./RippleGrid";

const NotFound = () => {
  return (
    <div
      className="text-white"
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
        background: "#120F17",
      }}
    >
      {/* Background animation */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <RippleGrid
          enableRainbow={false}
          gridColor="#5227FF"
          backgroundColor="#120F17"
          rippleIntensity={0.05}
          gridSize={10}
          gridThickness={15}
          mouseInteraction
          mouseInteractionRadius={0.8}
          opacity={1}
          fadeDistance={1.5}
          vignetteStrength={2}
          glowIntensity={0.1}
          gridRotation={0}
        />
      </div>

      {/* Foreground content */}
      <div
        className="pointer-events-none flex min-h-screen items-center justify-center px-6"
        style={{ position: "relative", zIndex: 10 }}
      >
        <div className="text-center">
          <h1 className="text-8xl font-bold tracking-tight text-purple-400">
            404
          </h1>

          <p className="mt-4 text-xl font-medium">Page does not exist</p>

          <p className="mt-2 text-sm text-neutral-400">
            The page you're looking for couldn't be found.
          </p>

          <Link
            to="/"
            className="pointer-events-auto mt-6 inline-block rounded-lg border border-purple-400/40 bg-purple-500/10 px-5 py-2.5 text-sm font-medium text-purple-300 backdrop-blur-sm transition hover:bg-purple-500/20 hover:text-purple-200"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;