import Link from "next/link";
import { Callout } from "@/components/docs/Callout";

export default function ProfilePage() {
  return (
    <>
      <h1>Profile</h1>
      <p className="lead">
        Your profile is your public identity on CodeSync. It showcases your
        repositories, contributions, and activity to the community.
      </p>

      <hr />

      <h2 id="updating-your-profile" className="heading-anchor">
        Updating Your Profile
      </h2>
      <p>
        To update your profile, navigate to your profile page and click the{" "}
        <strong>Edit Profile</strong> button. You can modify:
      </p>
      <ul>
        <li>
          <strong>Username</strong> — Your public identifier on CodeSync.
          Changing it will affect your profile URL.
        </li>
        <li>
          <strong>Bio</strong> — A short description about yourself. Each line
          is stored separately and displayed as a paragraph.
        </li>
        <li>
          <strong>Profile Picture</strong> — Upload a new avatar image.
        </li>
      </ul>
      <p>
        After making changes, click <strong>Save</strong> to update your profile.
        Changes are visible immediately on your public profile page.
      </p>

      <h2 id="changing-your-avatar" className="heading-anchor">
        Changing Your Avatar
      </h2>
      <p>
        Your avatar is displayed next to your name across the platform. You can
        change it from the edit profile page:
      </p>
      <ol>
        <li>Go to your profile and click <strong>Edit Profile</strong>.</li>
        <li>
          Click on the avatar section to upload a new image. The image is
          converted to a data URI and stored securely.
        </li>
        <li>
          If you do not upload an avatar, your initials will be displayed
          automatically based on your username.
        </li>
      </ol>
      <Callout type="tip">
        For the best results, use a square image. The avatar will be displayed
        in a circular frame.
      </Callout>
      <p>
        Avatars are available in multiple sizes throughout the application:
        Small (sm), Medium (md), Large (lg), Extra Large (xl), and 2X Large
        (xxl).
      </p>

      <h2 id="viewing-contributions" className="heading-anchor">
        Viewing Contributions
      </h2>
      <p>
        CodeSync tracks your activity and displays it as a GitHub-style
        contribution heatmap on your profile. The following activities are
        recorded:
      </p>
      <ul>
        <li>Creating a repository (<code>REPO_CREATED</code>)</li>
        <li>Making a commit (<code>COMMIT</code>)</li>
        <li>Pushing changes (<code>PUSH</code>)</li>
        <li>Creating an issue (<code>ISSUE_CREATED</code>)</li>
        <li>Closing an issue (<code>ISSUE_CLOSED</code>)</li>
        <li>Starring a repository (<code>STARRED_REPO</code>)</li>
      </ul>
      <p>
        To view your full contribution history:
      </p>
      <ol>
        <li>
          Navigate to your profile page to see the mini heatmap overview.
        </li>
        <li>
          Click <strong>View All Contributions</strong> or navigate to{" "}
          <code>/profile/[id]/contributions</code> for the full-page view.
        </li>
        <li>
          Use the <strong>year picker</strong> to navigate between different
          years of activity.
        </li>
        <li>
          Hover over individual squares to see the exact contribution count for
          that day.
        </li>
      </ol>
      <Callout type="note">
        Contribution data is calculated based on your activities throughout the
        year. The heatmap uses a color gradient from light to dark green to
        indicate activity levels.
      </Callout>

      <h2 id="account-settings" className="heading-anchor">
        Account Settings
      </h2>
      <p>
        Your account settings are accessible from your profile page via the
        sidebar navigation. The following settings are available:
      </p>

      <h3>Change Password</h3>
      <p>
        To change your password, navigate to <code>/profile/[id]/password</code>.
        You will need to provide:
      </p>
      <ul>
        <li><strong>Current Password</strong> — Your existing password.</li>
        <li><strong>New Password</strong> — Your new password (min 6 characters).</li>
        <li><strong>Confirm Password</strong> — Re-enter your new password.</li>
      </ul>
      <Callout type="warning" title="Password Requirements">
        Passwords must be at least 6 characters long. Make sure to use a
        combination of letters, numbers, and special characters for better
        security.
      </Callout>

      <h3>CLI Token</h3>
      <p>
        Your CLI authentication token is available at{" "}
        <code>/profile/[id]/cli-token</code>. This is the JWT token you need to
        authenticate the CodeSync CLI. You can:
      </p>
      <ul>
        <li>
          <strong>View</strong> — Show the full token (with a reveal/hide
          toggle).
        </li>
        <li>
          <strong>Copy</strong> — Copy the token to your clipboard.
        </li>
        <li>
          <strong>Follow CLI Setup Instructions</strong> — Step-by-step guide
          for using the token with the CLI.
        </li>
      </ul>
      <p>
        For more details about CLI authentication, see the{" "}
        <Link href="/docs/cli">CLI Guide</Link>.
      </p>

      <h3>Profile Sidebar</h3>
      <p>
        When viewing your profile pages, a sidebar provides quick access to:
      </p>
      <ul>
        <li>View Profile</li>
        <li>Edit Profile</li>
        <li>Change Password</li>
        <li>Contributions</li>
        <li>CLI Token</li>
      </ul>
    </>
  );
}
