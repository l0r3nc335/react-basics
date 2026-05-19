import { useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Upload } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/hris/api/client'
import { endpoints } from '@/hris/api/endpoints'
import { queryKeys } from '@/hris/api/queryKeys'
import type { HRDocument } from '@/hris/types'
import { PageHeader } from '@/hris/components/shared/PageHeader'
import { Button } from '@/hris/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/hris/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/hris/components/ui/dialog'
import { Input } from '@/hris/components/ui/input'
import { Label } from '@/hris/components/ui/label'

export default function DocumentsPage() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: documents, isLoading } = useQuery({
    queryKey: queryKeys.documents,
    queryFn: () => api<HRDocument[]>(endpoints.documents),
  })

  const uploadMutation = useMutation({
    mutationFn: (body: Partial<HRDocument>) =>
      api(endpoints.documents, { method: 'POST', body: JSON.stringify(body) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents })
      toast.success('Document uploaded')
      setDialogOpen(false)
    },
  })

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    uploadMutation.mutate({
      name: fd.get('name') as string,
      category: fd.get('category') as string,
      size: '1.2 MB',
      url: '#',
    })
  }

  return (
    <div>
      <PageHeader
        title="Documents"
        description="HR files and policies"
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Upload className="h-4 w-4" /> Upload
          </Button>
        }
      />
      <input ref={fileRef} type="file" className="hidden" />
      {isLoading ? <p>Loading...</p> : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents?.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell>{doc.category}</TableCell>
                <TableCell>{doc.size}</TableCell>
                <TableCell>{new Date(doc.uploadedAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Upload Document</DialogTitle></DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4">
            <div><Label>Name</Label><Input name="name" required /></div>
            <div><Label>Category</Label><Input name="category" placeholder="Policy" required /></div>
            <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>Choose File</Button>
            <Button type="submit">Upload Metadata</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
