import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Loading } from "@/components/Loading";
import { api } from "@/utils/api";
import moment from "moment";
import { TrashIcon } from "@heroicons/react/24/solid";

const Entry = () => {
  const { status: sessionStatus } = useSession();
  const { replace, query } = useRouter();
  const entryId = Array.isArray(query.pid) ? query.pid[0] : query.pid;

  const {
    data: entryData,
    status: entryStatus,
    refetch: refetchEntry,
  } = api.journalling.getEntryById.useQuery(
    { id: entryId! },
    { enabled: entryId !== undefined },
  );

  const { mutate: deletionMutation } = api.journalling.deleteEntry.useMutation({
    onSuccess() {
      replace("/entries");
    },
  });

  const { mutate: rateMoodMutation, status: rateMoodStatus } =
    api.ai.rateEntry.useMutation({
      onSuccess() {
        refetchEntry();
      },
    });

  const ratingToEmoji = (rating: number) => {
    if (rating < 2) {
      return {
        text: "Very Sad 😔",
        color: "bg-red-700",
      };
    } else if (rating <= 4) {
      return {
        text: "Sad ☹️",
        color: "bg-orange-700",
      };
    } else if (rating === 5) {
      return {
        text: "Normal 😐",
        color: "bg-indigo-700",
      };
    } else if (rating <= 8) {
      return {
        text: "Happy 😁",
        color: "bg-teal-700",
      };
    }

    return {
      text: "Very Happy 😅",
      color: "bg-emerald-700",
    };
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
        <title>Entry</title>
      </Head>

      <section className="new-container">
        {entryData !== null && (
          <div className="mx-auto flex w-1/2 flex-col gap-5">
            <div className="flex flex-row items-center justify-between">
              <h1 className="font-poppins text-3xl font-extrabold text-gray-50">
                {moment(entryData?.dateCreated).format("MMMM Do YYYY")}
              </h1>
              {entryData?.moodRating === null && (
                <button
                  disabled={rateMoodStatus === "loading"}
                  className={`${
                    rateMoodStatus === "loading" && "cursor-not-allowed"
                  } flex justify-center rounded-sm bg-gradient-to-br from-sky-700 to-sky-800 p-2 px-8 font-poppins font-bold text-gray-50`}
                  onClick={() => rateMoodMutation({ id: entryId! })}
                >
                  Analyse Mood
                </button>
              )}
              <button
                className="rounded-sm bg-gradient-to-br from-gray-700 to-gray-800 p-2"
                onClick={() => deletionMutation({ id: entryId! })}
              >
                <TrashIcon width={25} className="text-gray-50" />
              </button>
            </div>
            {entryData?.moodRating && (
              <div
                className={`w-max justify-center rounded-2xl p-3 font-poppins text-lg text-gray-50 ${
                  ratingToEmoji(entryData.moodRating).color
                }`}
              >
                {ratingToEmoji(entryData.moodRating).text}
              </div>
            )}
            <p className="whitespace-pre-line bg-gray-900 p-5 font-monserrat text-lg text-gray-50">
              {entryData?.content}
            </p>
          </div>
        )}
      </section>
    </>
  );
};

export default Entry;
