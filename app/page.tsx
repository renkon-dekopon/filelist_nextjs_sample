'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const formSchema = z.object({
  files: z.custom<FileList>().refine((value) => value.length > 0, { message: '必須です' }),
});

const convertFileListToFiles = (fileList: FileList): File[] => Array.from(fileList).filter((_, index) => fileList.item(index));

const convertFilesToFileList = (files: File[]): FileList => {
  const dataTransfer = new DataTransfer();
  files.map((file) => dataTransfer.items.add(file));
  return dataTransfer.files;
};

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const watchFiles = form.watch('files');
  const files = useMemo(() => {
    if (!watchFiles || !watchFiles.length) return [];

    return convertFileListToFiles(watchFiles);
  }, [watchFiles]);

  const onSubmit = async ({ files }: z.infer<typeof formSchema>) => {
    // TODO: fileの送信
  };

  const handleRemoveFile = useCallback(
    (targetIndex: number) => {
      const dataTransfer = new DataTransfer();

      files.map((file, index) => {
        if (targetIndex !== index) {
          dataTransfer.items.add(file);
        }
      });

      form.setValue('files', dataTransfer.files);
    },
    [form, files]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="files"
          render={({ field: { onChange } }) => (
            <FormItem className="mb-2">
              <FormLabel htmlFor="files">ファイルを{!files?.length ? '選択' : '追加'}</FormLabel>
              {files?.map((file, index) => {
                const url = URL.createObjectURL(file);
                return (
                  <div key={`${url}-${index}`} className="relative">
                    <img src={url} alt="プレビュー画像" className="w-full h-80 object-cover" />
                    <div onClick={() => handleRemoveFile(index)}>削除する</div>
                  </div>
                );
              })}
              <FormControl>
                <Input
                  id="files"
                  type="file"
                  required
                  onChange={(e) => {
                    if (e.target.files) {
                      const currentFiles = form.getValues('files');
                      if (currentFiles && currentFiles.length) {
                        onChange(
                          convertFilesToFileList([
                            ...convertFileListToFiles(currentFiles),
                            ...convertFileListToFiles(e.target.files),
                          ])
                        );
                      } else {
                        onChange(e.target.files);
                      }
                    }
                  }}
                  multiple
                  className="hidden"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center items-center">
          <Button className="mt-6 w-full bg-red-700" type="submit">
            送信
          </Button>
        </div>
      </form>
    </Form>
  );
}
