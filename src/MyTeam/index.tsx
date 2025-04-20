import Introduction from '../Components/Introduction';
import './MyTeam.css';
import member from '../assets/member.png'; // change this to your photo accordingly 
import member1 from '../assets/member1.png';

export default function MyTeam() {
    return (
        <>
            <Introduction />

            <section className="team-section">
                <div className="team-header">
                    <h4 className="team-subtitle">TEAM</h4>
                    <h2 className="team-title">Our Talents</h2>
                </div>
                <div className="team-container">
                    <div className="team-member">
                        <img src={member1} alt="Yu-Hsuan Yang" /> {/* // change this to your photo accordingly  */}
                        <h3>Yu-Hsuan Yang</h3>
                        <p>A passionate leader and skilled software engineer dedicated to enhancing campus life through innovative technology. With a strong background in full-stack development and agile project management, she leads the team in building solutions that empower Huskies to support each other.</p>

                    </div>
                    <div className="team-member">
                        <img src={member} alt="Che-Yi Wu" /> {/* // change this to your photo accordingly  */}
                        <h3>Che-Yi Wu</h3>
                        <p>A versatile coder and experienced software architect specializing in scalable web applications and robust backend systems. His commitment to clean code and efficient algorithms ensures HuskyBridge remains reliable, fast, and secure.</p>
                    </div>
                    <div className="team-member">
                        <img src={member1} alt="Tzu Ping Wang" /> {/* // change this to your photo accordingly  */}
                        <h3>Tzu Ping Wang</h3>
                        <p>A creative UI/UX designer and talented frontend developer, excelling in translating designs into interactive code. Her blend of aesthetic sensibility and coding skills ensures Huskies enjoy smooth, intuitive, and visually appealing user experiences.</p>
                    
                    </div>
                </div>
            </section>


        </>
    );
}



