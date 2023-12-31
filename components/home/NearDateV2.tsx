import NFTShowCard from "components/nft/NFTShowCard";
import { useAppContext } from "context/state";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { NFTModel } from "types";
import { format_number_2_digit } from "utils/format";
import {motion} from "framer-motion";

export default function NearDate() {
  const { account, contractNFT } = useAppContext();

  const [listNft, setListNft] = useState<Array<NFTModel>>([]);
  const [indexNearDateNow, setIndexNearDateNow] = useState<number | null>(null);
  const [indexNearDateNext, setIndexNearDateNext] = useState<number | null>(null);
  const [indexNearDatePrevious, setIndexNearDatePrevious] = useState<number | null>(null);

  useEffect(() => {
    getData();
    async function getData() {
      if (!contractNFT) return;
      try {
        let dateObj = new Date();
        let month = dateObj.getUTCMonth() + 1; //months from 1-12
        let day = dateObj.getUTCDate();
        let year = dateObj.getUTCFullYear();

        let token_id_now = `${year}${format_number_2_digit(month)}${format_number_2_digit(day)}`

        const data: Array<NFTModel> = await contractNFT.nft_tokens_by_date({
          "date": `${format_number_2_digit(month)}${format_number_2_digit(day)}`
        });

        data.sort((a, b) => a.token_id > b.token_id ? 1 : -1);
        setListNft(data)
        let index = data.findIndex(e => e.token_id == token_id_now || e.token_id > token_id_now);
        if (index == -1 && data.length > 0) {
          index = data.length - 1;
        }
        if (index != -1) {
          setIndexNearDateNow(index);
          if (index + 1 < data.length) {
            setIndexNearDateNext(index + 1);
          }
          if (index - 1 > -1) {
            setIndexNearDatePrevious(index - 1);
          }
        }

      } catch (err) {
        console.log(err);
      }
    }
  }, [account, contractNFT]);

  function nextIndex() {
    if (indexNearDateNext != null) {
      setIndexNearDateNow(indexNearDateNext);
      setIndexNearDateNext(indexNearDateNext + 1 < listNft.length ? indexNearDateNext + 1 : null);
      setIndexNearDatePrevious(indexNearDateNow);
    }
  }

  function previousIndex() {
    if (indexNearDatePrevious != null) {
      setIndexNearDateNow(indexNearDatePrevious);
      setIndexNearDateNext(indexNearDateNow);
      setIndexNearDatePrevious(indexNearDatePrevious - 1 < 0 ? null : indexNearDatePrevious - 1)
    }
  }

  return (
    <section className="py-24 flex justify-center flex-col items-center">   
      <div className="mt-4 max-w-xl mx-auto text-center">
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Link href='/mint'>
            <a className="btn-whimsical sm:text-3xl text-2xl font-medium title-font mb-2 text-white">
              Mint now
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}
