//受け取るPropsを決める
interface HeaderProps { 
    title :string; //表示するタイトル
    showBackButton? : boolean; //戻るボタン表示？ 
    onBackClick? : () => void; //戻るボタン押した時の処理 
    pageInfo? : string; //「3/12」みたいなテキスト
    navItems? : { label: string; href: string}[];   //ナビゲーション項目
}

//UI構造
export default function Header({
    title,
    showBackButton,
    onBackClick,
    pageInfo,
    navItems = [], 
}: HeaderProps) {
    return (
        <header className="sticky top-0 z-30 border-b border-gray-200">
            <div className="flex items-center justify-between px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-gray-800 sm:px-8 sm:text-xs">
                <div className="flex items-center gap-3">
                    <span className="font-semibold tracking-[0.24em]">{title}</span>
                </div>
                <div className="flex items-center gap-3">
                    <nav className="text-[11px] font-bold text-gray-700 hover:text-gray-400 hover:cursor-pointer" >お気に入り</nav>
                </div>
            </div>
        </header>
    );
}