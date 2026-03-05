import heroImg from "@/assets/hero-netflix.jpg";

const NetflixHero = () => {
  return (
    <div className="relative w-full h-[28vh] min-h-[180px] max-h-[250px]">
      <img
        src={heroImg}
        alt="Palomitas Redonditas"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />

      <div className="absolute bottom-10 left-4 md:left-12 max-w-lg z-10 animate-fade-in">
        <h1 className="font-display text-3xl md:text-5xl tracking-wider text-foreground mb-1">
          PALOMITAS REDONDITAS
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground font-medium">
          Con la profesora Carmela Vega
        </p>
      </div>
    </div>
  );
};

export default NetflixHero;
