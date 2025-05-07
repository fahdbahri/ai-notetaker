import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export function CaptionsAndSummary({ currentCaption, summary, activeTab, onTabChange}) {
  console.log("Rendering CaptionsAndSummary with caption:")
  
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList>
        <TabsTrigger value="captions">Live Captions</TabsTrigger>
        <TabsTrigger value="summary">Summary</TabsTrigger>
      </TabsList>
      <TabsContent value="captions">
        <Card>
          <CardContent className="p-4">
            <ScrollArea className="h-64">
              <p className="whitespace-pre-wrap">
                { currentCaption || "Waiting for transcription..."}
              </p>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
       <TabsContent value="summary">
        <Card>
          <CardContent className="p-4">
            <ScrollArea className="h-64">
              <p className="whitespace-pre-wrap">
                {summary || "No summary generated yet..."}
              </p>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
