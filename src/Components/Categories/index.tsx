import { Link } from 'react-router-dom';
import './Categories.css';

interface CategoryCardProps {
    title: string;
    description: string;
    buttonText: string;
    link: string;
    isRed?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, description, buttonText, link, isRed }) => {
    return (
        <div className={`category-card ${isRed ? 'red' : ''}`}>
            <h2>{title}</h2>
            <p>{description}</p>
            <Link to={link} className="category-button">
                {buttonText}
            </Link>
        </div>
    );
};

export default function Categories() {
    return (
        <section className="categories-section">
            <h1>Categories</h1>
            <div className="categories-container">
                <CategoryCard
                    title="General"
                    description="From event tickets to lost-and-found, this category covers everything else Huskies might need or offer."
                    buttonText="Community Help & More"
                    link="/general"

                />
                <CategoryCard
                    title="Borrow/ Lend"
                    description="Need something for a short time? Borrow books, gadgets, and more from fellow Huskies. Have extras? Lend them out and help your community."
                    buttonText="Find Items"
                    link="/borrow-lend"
                />
                <CategoryCard
                    title="Housing"
                    description="Looking for housing or roommates? Browse available rentals or list your place to connect with fellow Northeastern students."
                    buttonText="Explore Housing"
                    link="/housing"
                />
                <CategoryCard
                    title="Tutoring"
                    description="Need academic help? Find tutors for your subjects. Have expertise? Offer tutoring and support your peers."
                    buttonText="Find a Tutor"
                    link="/tutoring"
                />
            </div>
            <div className="categories-navigation">
                <button className="nav-button prev">←</button>
                <button className="nav-button next">→</button>
            </div>
        </section>
    );
}