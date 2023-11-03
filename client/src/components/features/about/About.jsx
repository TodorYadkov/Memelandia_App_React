import styles from './About.module.css';

export default function About() {
    return (
        <section className={`${styles['about']} max-width`}>
            <h1 className={styles['about-heading']}>About <span>Meme</span><span>Landia</span></h1>
            <div className={styles['about-description']}>
                <div className={styles['about-image-wrapper']}>
                    <img src="/assets/emoji-hi.svg" alt="Emoji hi" />
                    <h3>Welcome</h3>
                </div>
                <div>
                    <p>Where humor knows no bounds, and laughter reigns
                        supreme. Our mission is simple: to provide users with an effortless platform for sharing and
                        creating unique, side-splitting memes that spread joy and merriment across the digital
                        landscape.
                    </p>
                </div>
            </div>
            <div className={styles['about-vision']}>
                <div className={styles['about-image-wrapper']}>
                    <img src="/assets/emoji-drink.svg" alt="Emoji drink" />
                    <h3>Our Vision: Making the World Smile</h3>
                </div>
                <div>
                    <p>In the vast realm of the internet, we believe in the power of laughter to connect people from
                        all
                        corners of the globe. With MemeLandia, we aim to create a world where smiles are abundant,
                        and
                        happiness is just a meme away. Our vision is to turn the digital sphere into a better,
                        brighter,
                        and more cheerful place to live.

                    </p>
                </div>
            </div>
            <div className={styles['about-offer']}>
                <div className={styles['about-image-wrapper']}>
                    <img src="/assets/emoji-hands.svg" alt="Emoji hands" />
                    <h3>What We Offer</h3>
                </div>
                <ul>
                    <li><span>Meme Creation:</span> Express your creativity by crafting your own hilarious memes.
                        Our
                        user-friendly tools make meme creation a breeze.</li>
                    <li><span>Sharing Laughter:</span> Spread the joy by sharing your memes with friends, family,
                        and the entire
                        MemeLandia community.</li>
                    <li><span>Unlimited Fun:</span> Explore an ever-expanding collection of memes that will have you
                        in stitches.
                        From funny images to witty captions, we&apos;ve got it all.</li>
                </ul>
            </div>
            <div className={styles['about-join']}>
                <div className={styles['about-image-wrapper']}>
                    <img src="/assets/emoji-finger.svg" alt="Emoji finger" />
                    <h3>Join the Laughter Revolution</h3>
                </div>
                <p>At MemeLandia, we believe in the incredible power of laughter to break down barriers, transcend
                    language, and bring people closer together. Every meme shared is a step toward making the world
                    a better place, one smile at a time.</p>
            </div>
            <p className={styles['about-slogan']}>&quot;Smile: Making the World a Better Place to Live&quot;</p>
        </section>
    );
}