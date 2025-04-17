export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative w-20 h-20">
        <div className="absolute top-0 right-0 w-full h-full border-4 border-[#5B5AEC]/20 rounded-full" />
        <div className="absolute top-0 right-0 w-full h-full border-4 border-[#5B5AEC] rounded-full border-t-transparent animate-spin" />
      </div>
    </div>
  );
}