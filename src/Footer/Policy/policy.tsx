import "./policy.css";

export default function PrivacyPolicy() {
    return (
        <div className="policy-container">
            <div className="policy-box">
                <h1 className="policy-title">Privacy Policy</h1>
                <div className="policy-content">
                    <p>
                        HuskyBridge is committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your information.
                    </p>

                    <h2>1. Information Collection</h2>
                    <p>
                        We collect only the necessary information such as your name, email, and university affiliation to facilitate peer-to-peer support.
                    </p>

                    <h2>2. Use of Information</h2>
                    <p>
                        Your information is used strictly for platform functionality, including creating posts, communicating with users, and account verification.
                    </p>

                    <h2>3. Sharing of Data</h2>
                    <p>
                        We do not share your personal data with third parties. Internal data is used solely for platform improvement and usage analytics.
                    </p>

                    <h2>4. Cookies & Storage</h2>
                    <p>
                        We may use cookies to maintain session state. No tracking cookies or third-party cookies are used.
                    </p>

                    <h2>5. Your Rights</h2>
                    <p>
                        You may request to update or delete your account data at any time. Contact support if you wish to make changes to your data.
                    </p>

                    <p className="policy-updated">Last updated: April 20, 2025</p>
                </div>
            </div>
        </div>
    );
}
