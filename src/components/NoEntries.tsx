import { PencilIcon } from "@heroicons/react/24/solid";

export const NoEntries = () => {
  return (
    <div className="mx-auto flex w-3/4 flex-row items-center justify-center gap-8 rounded-sm border-gray-400 bg-slate-800/30 p-10 font-monserrat text-lg text-gray-50 md:w-1/2">
      <PencilIcon width={40} />
      <p>You don&apos;t have any entries yet...</p>
    </div>
  );
};
