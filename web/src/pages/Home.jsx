import Hero from '../components/Hero'
import HeroHighlights from '../components/HeroHighlights'
import ProgramsWeOffer from '../components/ProgramsWeOffer'
import WhyChooseUs from '../components/WhyChooseUs'
import MentorsSection from '../components/MentorsSection'
import ConsultationBanner from '../components/consultation/ConsultationBanner'
import AboutSnapshot from '../components/AboutSnapshot'
import LogoMarquee from '../components/LogoMarquee'
import StackingBanners from '../components/StackingBanners'
import GrowthSection from '../components/GrowthSection'
import CourseSlider from '../components/CourseSlider'

const Home = ({ isLoaded }) => {
  return (
    <div className="w-full">
      <Hero isLoaded={isLoaded} />
      <HeroHighlights />
      <ProgramsWeOffer />
      <WhyChooseUs />
      <AboutSnapshot />
      <MentorsSection />
      <CourseSlider />
      <LogoMarquee />
      <StackingBanners />
      <GrowthSection />
      <ConsultationBanner />
    </div>
  )
}

export default Home
