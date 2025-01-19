import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

export function Sidebar() {
  return (
    <aside className="w-64 bg-white p-4 border-r">
      <h2 className="text-lg font-semibold mb-4">Past Recordings</h2>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        {[...Array(10)].map((_, i) => (
          <Card key={i} className="mb-2">
            <CardHeader className="p-3">
              <CardTitle className="text-sm">Recording {i + 1}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </ScrollArea>
    </aside>
  )
}

