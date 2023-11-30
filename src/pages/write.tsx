import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Loading } from "@/components/Loading";
import { api } from "@/utils/api";

const Write = () => {
  const { status: sessionStatus } = useSession();
  const { replace } = useRouter();
  const [journalEntry, setJournalEntry] = useState("");

  const { mutate: createEntry } = api.journalling.createEntry.useMutation({
    onSuccess(data) {
      replace(`/entries/${data.id}`);
    },
  });

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createEntry({ content: journalEntry });
  };

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      replace("/");
    }
  }, [sessionStatus]);

  if (sessionStatus === "loading") return <Loading />;
  if (sessionStatus === "unauthenticated") return;

  return (
    <>
      <Head>
        <title>Write</title>
      </Head>
      <section className="new-container">
        <h1 className="text-center font-poppins text-4xl font-bold text-neutral-50">
          Write
        </h1>
        <form
          className="flex w-full flex-col justify-center gap-5"
          onSubmit={handleFormSubmit}
        >
          <textarea
            cols={30}
            rows={10}
            className="mx-auto rounded-sm border border-slate-800 bg-gray-300 p-5 font-monserrat tracking-wide md:w-1/2"
            placeholder="Write down your thoughts mate"
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            required
          ></textarea>
          <button
            type="submit"
            className="mx-auto w-2/3 whitespace-pre-line rounded-sm bg-gradient-to-br from-gray-700 to-gray-800 py-3 font-poppins text-xl font-bold text-gray-50 md:w-1/2"
          >
            Finish
          </button>
        </form>
      </section>
    </>
  );
};

export default Write;
