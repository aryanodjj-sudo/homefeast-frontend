import chefs from "../../data/chefs";
import ChefCard from "./ChefCard";
import SectionTitle from "../Common/SectionTitle";

const ChefSection = () => {
  return (
    <section id="chefs" className="scroll-mt-24 bg-rice py-20 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <SectionTitle
          eyebrow="Meet the cooks"
          title="The home chefs behind your meals"
          subtitle="Every HomeFeast chef cooks from their own kitchen, not a commercial line — this is who's actually behind today's menu."
        />

        <div className="flex flex-wrap justify-center gap-6">
          {chefs.map((chef) => (
            <ChefCard key={chef.id} chef={chef} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChefSection;