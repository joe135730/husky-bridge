import Introduction from '../Components/Introduction';
import Categories from '../Components/Categories';
import Search from '../Components/Search';
import './LandingPage.css';

export default function LandingPage() {
    return (
        <div className="landing-page">
            <Introduction />
            <hr />
            <Categories />
            <hr />
            <Search />
        </div>
    );
}