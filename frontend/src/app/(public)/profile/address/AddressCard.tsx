'use client'

import { IAddress } from "@/app/_interfaces/address";
import DeleteAddressBtn from "./DeleteAddressBtn";
import { useLanguage } from "@/context/LanguageContext";

export default function AddressCard({ address }: { address: IAddress }) {
    const { language } = useLanguage();
    const isAr = language === 'ar';

    return (
        <div className="bg-white dark:bg-[#28211E] p-5 border border-[#EBDED6] dark:border-[#3D332E] border-s-4 border-s-[#C48D80] rounded-2xl shadow-sm relative group hover:shadow-md duration-200">
            <span className="absolute top-3 end-3 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-[#C48D80] bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E]">
                {address.city}
            </span>
            <div className="mb-3">
                <DeleteAddressBtn id={address._id} />
            </div>
            <div className="space-y-1.5 text-xs">
                <p className="text-sm font-bold text-[#2B2320] dark:text-[#FAF6F0]">
                    {isAr ? 'مكان العنوان:' : 'Address Place:'} <span className="text-[#C48D80]">{address.name}</span>
                </p>
                <p className="text-[#988172]">
                    {isAr ? 'الهاتف:' : 'Phone:'} <span className="text-[#2B2320] dark:text-white font-medium">{address.phone}</span>
                </p>
                <p className="text-[#988172]">
                    {isAr ? 'التفاصيل:' : 'Details:'} <span className="text-[#2B2320] dark:text-white font-medium">{address.details}</span>
                </p>
            </div>
        </div>
    )
}
