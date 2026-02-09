import Image from "next/image";

export function AuthHero() {
    return (
        <div className="relative w-full h-full overflow-hidden rounded-[40px] shadow-2xl shadow-slate-200/50">
            <Image
                className="absolute inset-0 h-full w-full object-cover scale-105 hover:scale-100 transition-transform duration-[3000ms] ease-out"
                src="/hero_photographer_1770613553467.png"
                alt="Photographer at work"
                fill
                sizes="50vw"
                priority
            />
        </div>
    );
}
