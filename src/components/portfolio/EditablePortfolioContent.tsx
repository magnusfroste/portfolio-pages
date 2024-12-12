import { Link } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { UseFormReturn } from "react-hook-form";
import { ImageUploadField } from "../ImageUploadField";
import { FormProvider } from "react-hook-form";

type EditablePortfolioContentProps = {
  form: UseFormReturn<any>;
  item: any;
};

export const EditablePortfolioContent = ({ form, item }: EditablePortfolioContentProps) => {
  return (
    <FormProvider {...form}>
      <CardHeader className="p-0">
        <Input
          {...form.register('header')}
          defaultValue={item.header}
          className="text-2xl font-bold mb-6"
          placeholder="Enter title"
        />
      </CardHeader>
      <CardContent className="p-0">
        <Textarea
          {...form.register('description')}
          defaultValue={item.description}
          className="mb-6 text-lg leading-relaxed min-h-[200px]"
          placeholder="Enter description"
          rows={8}
        />
        <div className="flex items-center space-x-2 mb-10">
          <Link className="h-4 w-4 text-muted-foreground" />
          <Input
            {...form.register('link')}
            defaultValue={item.link}
            placeholder="Enter project URL"
            className="flex-1"
          />
        </div>
      </CardContent>
    </FormProvider>
  );
};