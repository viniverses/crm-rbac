import { OrganizationForm } from '@/app/(app)/org/organization-form';
import { InterceptedSheetContent } from '@/components/intercepted-sheet-content';
import { SheetHeader, SheetTitle } from '@/components/ui/sheet';

export default async function CreateOrganizationPage() {
  return (
    <InterceptedSheetContent>
      <SheetHeader>
        <SheetTitle>Criar Organização</SheetTitle>
      </SheetHeader>

      <div className="flex-1 overflow-y-scroll px-8 py-4">
        <OrganizationForm />
      </div>
    </InterceptedSheetContent>
  );
}
