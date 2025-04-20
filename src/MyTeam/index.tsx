
import Introduction from '../Components/Introduction';
import './MyTeam.css';
import member from '../assets/member.png';
import member1 from '../assets/member1.png';

export default function MyTeam() {
    return (
        <>
            <Introduction />

            <section className="team-section">
                <div className="team-box-wrapper">
                    <div className="team-header">
                        <h4 className="team-subtitle">TEAM</h4>
                        <h2 className="team-title">Our Talents</h2>
                    </div>

                    <div className="team-container">
                        <div className="team-member">
                            <img src={member1} alt="Yu-Hsuan Yang" />
                            <h3>Yu-Hsuan Yang</h3>
                            <p>
                                A passionate leader and skilled software engineer dedicated to enhancing campus life through innovative technology. With a strong background in full-stack development and agile project management, she leads the team in building solutions that empower Huskies to support each other.
                            </p>
                        </div>
                        <div className="team-member">
                            <img src={member} alt="Che-Yi Wu" />
                            <h3>Che-Yi Wu</h3>
                            <p>
                                A versatile coder and experienced software architect specializing in scalable web applications and robust backend systems. His commitment to clean code and efficient algorithms ensures HuskyBridge remains reliable, fast, and secure.
                            </p>
                        </div>
                        <div className="team-member">
                            <img src={member1} alt="Tzu Ping Wang" />
                            <h3>Tzu Ping (Jocelyn) Wang</h3>
                            <p>
                                A creative UI/UX designer and talented frontend developer, excelling in translating designs into interactive code. Her blend of aesthetic sensibility and coding skills ensures Huskies enjoy smooth, intuitive, and visually appealing user experiences.
                            </p>
                        </div>
                    </div>

                    <div className="github-links">
                        <h4 className="repo-subtitle">CS5610.35649.202530</h4>
                        <p>
                            🔗 React.js GitHub Repo:{' '}
                            <a href="https://github.com/joe135730/husky-bridge" target="_blank" rel="noopener noreferrer">
                                https://github.com/joe135730/husky-bridge
                            </a>
                        </p>
                        <p>
                            🔗 Node.js GitHub Repo:{' '}
                            <a href="https://github.com/joe135730/husky-bridge-server" target="_blank" rel="noopener noreferrer">
                                https://github.com/joe135730/husky-bridge-server
                            </a>
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
