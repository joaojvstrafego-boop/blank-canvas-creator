import heroBanner from "@/assets/hero-banner.jpg";

const WelcomeBanner = () => {
  return (
    <div className="relative rounded-2xl overflow-hidden mb-8 animate-fade-in">
      <img
        src={heroBanner}
        alt="Palomitas Redonditas - Curso de Carmela Vega"
        className="w-full h-56 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
      <div className="absolute inset-0 flex items-center p-8">
        <div>
          <p className="text-primary-foreground/80 text-sm font-medium mb-1 tracking-wide uppercase">
            Bienvenida de vuelta 👋
          </p>
          <h1 className="text-3xl font-display font-bold text-primary-foreground mb-2">
            Palomitas Redonditas
          </h1>
          <p className="text-primary-foreground/70 text-sm max-w-md">
            Con la profesora <span className="font-semibold text-primary-foreground">Carmela Vega</span>. Continúa donde lo dejaste y domina el arte de las palomitas perfectas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
