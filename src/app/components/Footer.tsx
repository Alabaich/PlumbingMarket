export default function Footer() {
    return (
      <footer style={{ padding: "1rem", background: "#f0f0f0", borderTop: "1px solid #ccc", marginTop: "2rem" }}>
        <p>&copy; {new Date().getFullYear()} PlumbingMarket. All rights reserved.</p>
      </footer>
    );
  }
  