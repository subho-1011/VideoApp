import React from "react";

export default function Page({ params }: { params: { channel: string } }) {
    // const paramss = useParams();

    return <h1>My Page: {params.channel}</h1>;
}
