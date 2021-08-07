import Head from "next/head";
import {useState} from 'react'

export const HeadTag = (props) => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Head>
        <title>{props.title}</title>
        <meta name="twitter:card" content="summary"/>
        <meta name="twitter:site" content="azukibar_D"/>
      </Head>
    </div>
  )
}