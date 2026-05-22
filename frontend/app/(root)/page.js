import Link from "next/link";
import HeroSection from "../components/frontend/Home/Other/HeroSection";
import WhyChooseUs from "../components/frontend/Home/Other/WhyChooseUs";
import IeltsModulesAndCTA from "../components/frontend/Home/Other/IeltsModulesAndCTA";
import StudentStatsSection from "../components/frontend/Home/Other/StudentStatsSection";
import ImproveBandScoreSection from "../components/frontend/Home/Other/ImproveBandScoreSection";
import StudentFeedbackSection from "../components/frontend/Home/Other/StudentFeedbackSection";
import PricingSection from "../components/frontend/Home/Other/PricingSection";
import MockTestPacksSection from "../components/frontend/Home/Other/MockTestPacksSection";
import PlanFeatureComparison from "../components/frontend/Home/Other/PlanFeatureComparison";
import IeltsExpertBlog from "../components/frontend/Home/Other/IeltsExpertBlog";
import FaqAccordionSection from "../components/frontend/Home/Other/FaqAccordionSection";
import CtaBannerSection from "../components/frontend/Home/Other/CtaBannerSection";

const portalCards = [
    {
        title: "Admin",
        href: "/admin",
        description: "Control permissions, monitor activity, and keep the platform aligned across teams.",
    },
    {
        title: "Teacher",
        href: "/teacher",
        description: "Manage classes, shape learning flows, and keep student performance visible at a glance.",
    },
    {
        title: "Student",
        href: "/student",
        description: "Give learners a focused space for lessons, tasks, milestones, and progress tracking.",
    },
];

export default function Home() {
    return (        
        <main className="flex flex-col gap-16 sm:gap-24">
            {/* Hero Section for Desktop & Mobile */}

            <div className="hidden md:block">
                <HeroSection />
                <WhyChooseUs />
                <IeltsModulesAndCTA />
                <StudentStatsSection />
                <ImproveBandScoreSection />
                <StudentFeedbackSection />
                <PricingSection />
                <MockTestPacksSection />
                <PlanFeatureComparison />
                <IeltsExpertBlog />
                <FaqAccordionSection />
                <CtaBannerSection />
            </div>
            <div className="block md:hidden">
                {/* <HeroSection /> */}
            </div>

        </main>
    );
}
