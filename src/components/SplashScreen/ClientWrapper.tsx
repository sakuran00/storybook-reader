"use client";

import dynamic from "next/dynamic";

const SplashScreen =dynamic(() => import ("./index"), { ssr: false });

export default function SplashScreenWrapper(){
  return<SplashScreen />
}