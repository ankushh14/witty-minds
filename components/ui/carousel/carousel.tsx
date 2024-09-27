import { cn } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { NextButton, PrevButton, usePrevNextButtons } from "./carousel-buttons";
import styles from "./carousel.module.css";

const EmblaCarousel = ({ images }: { images: string[] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <div className={cn(styles["embla"])} ref={emblaRef}>
      <div className={cn(styles["embla__container"])}>
        {images.map((item, index) => (
          <div className={cn(styles["embla__slide"])} key={index}>
            <Image
              className={styles["embla__slide__img"]}
              src={item}
              alt={item}
              width={1000}
              height={1000}
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <div className={styles["embla__buttons"]}>
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      )}
    </div>
  );
};

export default EmblaCarousel;
