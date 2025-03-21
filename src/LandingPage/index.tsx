import Introduction from '../Components/Introduction';
import Categories from '../Components/Categories';
import './LandingPage.css';

export default function LandingPage() {
    return (
        <div className="landing-page">
            <Introduction />
            <hr />
            <Categories />
        </div>
    );
}