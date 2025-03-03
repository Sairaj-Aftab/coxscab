import LostAndFoundHeader from "@/components/LostAndFoundHeader";

export default function ({ children }) {
  return (
    <section>
      <LostAndFoundHeader />
      {children}
    </section>
  );
}
