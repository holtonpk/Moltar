import {useRouter} from "next/navigation";
import {Icons} from "@/components/icons";
import {Dispatch, SetStateAction, useCallback, useMemo, useState} from "react";
// import BlurImage from "#/ui/blur-image";
import {toast} from "@/components/ui/use-toast";

import {useAuth} from "@/context/user-auth";
import {Input} from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";

function DeleteAccountModal({
  showDeleteAccountModal,
  setShowDeleteAccountModal,
}: {
  showDeleteAccountModal: boolean;
  setShowDeleteAccountModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const {DeleteAccount} = useAuth()!;

  async function deleteAccount() {
    setDeleting(true);
    const res = await DeleteAccount();
    if ("error" in res) {
      toast({
        title: "An account with this email already exists.",
        description: "Please please check your email and try again.",
        variant: "destructive",
      });
      setDeleting(false);
      setShowDeleteAccountModal(false);
    } else {
      setTimeout(() => {
        router.push("/register");
      }, 200);
    }
  }

  return (
    <AlertDialog
      open={showDeleteAccountModal}
      onOpenChange={setShowDeleteAccountModal}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription>
            Warning: This will permanently delete your account and all your{" "}
            Moltar data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await deleteAccount();
            setShowDeleteAccountModal(false);
            // await deleteAccount();
          }}
          className="flex flex-col   text-left  w-full"
        >
          <div>
            <label
              htmlFor="verification"
              className="block text-sm text-muted-foreground "
            >
              To verify, type{" "}
              <span className="font-semibold text-primary">
                confirm delete account
              </span>{" "}
              below
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <Input
                type="text"
                name="verification"
                id="verification"
                pattern="confirm delete account"
                required
                autoFocus={false}
                // className="block w-full rounded-md border-gray-300 pr-10 text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
              />
            </div>
          </div>

          <Button variant="destructive" className="mt-3">
            {deleting && <Icons.spinner className="mr-2 h-6 w-6" />}
            Confirm delete account
          </Button>
          <div className="mt-3 w-full">
            <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
    // <Modal
    //   showModal={showDeleteAccountModal}
    //   setShowModal={setShowDeleteAccountModal}
    // >
    //   <div className="inline-block w-full transform overflow-hidden bg-white align-middle shadow-xl transition-all sm:max-w-md sm:rounded-2xl sm:border sm:border-gray-200">
    //     <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-4 pt-8 sm:px-16">
    //       <BlurImage
    //         src={
    //           session?.user?.image ||
    //           `https://avatars.dicebear.com/api/micah/${session?.user?.email}.svg`
    //         }
    //         alt={
    //           session?.user?.name || session?.user?.email || "Delete Account"
    //         }
    //         className="h-10 w-10 rounded-full border border-gray-200"
    //         width={20}
    //         height={20}
    //       />
    //       <h3 className="text-lg font-medium"></h3>
    //       <p className="text-center text-sm text-gray-500">

    //       </p>
    //     </div>

    //   </div>
    // </Modal>
  );
}

export function useDeleteAccountModal() {
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const DeleteAccountModalCallback = useCallback(() => {
    return (
      <DeleteAccountModal
        showDeleteAccountModal={showDeleteAccountModal}
        setShowDeleteAccountModal={setShowDeleteAccountModal}
      />
    );
  }, [showDeleteAccountModal, setShowDeleteAccountModal]);

  return useMemo(
    () => ({
      setShowDeleteAccountModal,
      DeleteAccountModal: DeleteAccountModalCallback,
    }),
    [setShowDeleteAccountModal, DeleteAccountModalCallback]
  );
}
