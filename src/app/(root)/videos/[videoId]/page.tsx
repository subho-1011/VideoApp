// import { useParams } from "next/navigation";

export default function Page({ params }: { params: { videoId: string } }) {
    // const paramss = useParams();

    return <h1>My Page: {params.videoId}</h1>;
}
