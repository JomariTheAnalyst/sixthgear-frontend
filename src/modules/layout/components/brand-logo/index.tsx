const Logo = () => {
    return (
        <div className="flex items-start whitespace-nowrap">
            {/* Mobile: Single line "SIXTHGEAR MOTO" */}
            <span className="font-sans text-base sm:text-xl md:text-2xl font-black tracking-tighter uppercase leading-none">
                SixthGear Moto
            </span>
            <span className="ml-[1px] inline-flex items-center justify-center p-[2px] mt-[1px]">
                <div className="border border-current rounded-full w-[10px] h-[10px] sm:w-[12px] sm:h-[12px] md:w-[14px] md:h-[14px] flex items-center justify-center">
                    <span className="text-[6px] sm:text-[7px] md:text-[8px] font-bold leading-none translate-y-[0.5px]">TM</span>
                </div>
            </span>
        </div>
    )
}

export default Logo

