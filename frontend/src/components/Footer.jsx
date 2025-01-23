const footerLinks = {
    Products: ['Shoes', 'Clothing', 'Accessories', 'New Arrival', 'Upcoming'],
    Collections: ['Shoes', 'Clothing', 'Accessories', 'New Arrival', 'Upcoming'],
    Support: ['FAQs', 'Cookie Policy', 'Terms', 'Account', 'Upcoming'],
    'Company Info': ['About', 'Support', 'Accessories', 'New Items', 'Upcoming'],
  }
  
  export default function Footer() {
    return (
      <footer className="bg-black text-white py-12 px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>
    )
  }
  
  