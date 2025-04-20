import "./tos.css";

export default function TOS() {
    return (
        <div className="tos-container">
            <div className="tos-box">
                <h1 className="tos-title">Terms of Service</h1>
                <div className="tos-content">
                    <p>
                        Welcome to HuskyBridge! By accessing or using our platform, you agree to be bound by the following terms and conditions.
                    </p>

                    <h2>1. Eligibility</h2>
                    <p>
                        Only currently enrolled students, staff, or faculty at Northeastern University are eligible to register and use HuskyBridge.
                    </p>

                    <h2>2. Acceptable Use</h2>
                    <p>
                        You agree to use the platform responsibly. Any abuse, harassment, spam, or fraudulent activity may result in account suspension.
                    </p>

                    <h2>3. Content and Responsibility</h2>
                    <p>
                        You retain ownership of your content but grant us the right to display and distribute it within the platform. You're responsible for what you post.
                    </p>

                    <h2>4. Account Suspension</h2>
                    <p>
                        We reserve the right to remove content or suspend users who violate these terms or the spirit of the HuskyBridge community.
                    </p>

                    <h2>5. Modifications</h2>
                    <p>
                        Terms may be updated periodically. Continued use after updates means you accept the changes.
                    </p>

                    <p className="tos-updated">Last updated: April 20, 2025</p>
                </div>
            </div>
        </div>
    );
}
