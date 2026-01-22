export interface Book {
    id: string;
    title: string;
    subtitle: string;
    status: 'available' | 'unavailable';
    author: string;
    cover: string;
}

export const BOOKS : Book[] = [
    {
    id: "princess-adventure",
    title: "ゆうきあるおひめさまのぼうけん",
    subtitle: "日本語 / English",
    status: "available",
    author: "saku",
    cover: "/covers/おひめさまのぼうけん.png"
    },
    {
    id: "magic-forest-princess",
    title: "まほうのもりのゆうきなおひめさま",
    subtitle: "日本語 / English",
    status: "available",
    author: "saku",
    cover: "/covers/もりのゆうきなおひめさま.png"
    },
    {
    id: "coming-soon",
    title: "追加予定",
    subtitle: "Coming soon",
    status: "unavailable",
    author: "",
    cover: "/covers/magic book (ロゴ).png"
    },

]