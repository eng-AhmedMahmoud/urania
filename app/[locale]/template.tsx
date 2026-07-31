import PageFx from "@/components/PageFx";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-anim">
      <PageFx />
      {children}
    </div>
  );
}
