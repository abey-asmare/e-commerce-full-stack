import { Button } from "@/components/ui/button"

export function Newsletter() {
  return (
    <section className="bg-cyan-500 text-white py-8 px-6">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <p className="text-lg font-medium">Don&apos;t Miss Your Monthly Discount</p>
        <Button variant="secondary" className="bg-black text-white hover:bg-black/90">
          Sign Up Up
        </Button>
      </div>
    </section>
  )
}

