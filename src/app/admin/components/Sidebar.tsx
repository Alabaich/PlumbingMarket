'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Sidebar: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const getIconPath = (name: string) => `/icons/${name.toLowerCase()}.svg`;

  return (
    <div className="admin-sidebar w-64 h-full">
      <ul className="p-4">
      <li className="mb-2">
          <Link
            href="/admin/dashboard"
            className="w-full text-left p-2 rounded flex justify-between items-center transition-all hover:bg-white/90 hover:backdrop-blur-lg hover:shadow-sm"
          >
            <div className="flex gap-2">
              <Image
                src={getIconPath('home')}
                alt="Dashboard Icon"
                width={19}
                height={19}
              />
              Dashboard
            </div>
          </Link>
        </li>
        <li className="mb-2">
          <button
            className="w-full text-left p-2 rounded flex justify-between items-center transition-all hover:bg-white/90 hover:backdrop-blur-lg hover:shadow-sm"
            onClick={() => toggleDropdown('orders')}
          >
            <div className="flex gap-2">
              <Image
                src={getIconPath('orders')}
                alt="Orders Icon"
                width={19}
                height={19}
              />
              Orders
            </div>

            <Image
              src="/icons/rightArrow.svg"
              alt="Right Arrow"
              width={19}
              height={19}
              className={`transition-transform ${openDropdown === 'orders' ? 'rotate-90' : ''}`}
            />

          </button>
          {openDropdown === 'orders' && (
            <ul className="pl-4">
              <li>
                <Link href="/admin/orders" className="block p-2 rounded transition-all hover:bg-white/90 hover:backdrop-blur-lg hover:shadow-sm">
                  Orders
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li className="mb-2">
          <button
            className="w-full text-left p-2 rounded flex justify-between items-center transition-all hover:bg-white/90 hover:backdrop-blur-lg hover:shadow-sm"
            onClick={() => toggleDropdown('products')}
          >
            <div className="flex gap-2">
              <Image
                src={getIconPath('products')}
                alt="Products Icon"
                width={19}
                height={19}
              />
              Products
            </div>

            <Image
              src="/icons/rightArrow.svg"
              alt="Right Arrow"
              width={19}
              height={19}
              className={`transition-transform ${openDropdown === 'products' ? 'rotate-90' : ''}`}
            />

          </button>
          {openDropdown === 'products' && (
            <ul className="pl-4">
              <li>
                <Link href="/admin/products" className="block p-2 rounded transition-all hover:bg-white/90 hover:backdrop-blur-lg hover:shadow-sm">
                  Products
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li className="mb-2">
          <button
            className="w-full text-left p-2 rounded flex justify-between items-center transition-all hover:bg-white/90 hover:backdrop-blur-lg hover:shadow-sm"
            onClick={() => toggleDropdown('customers')}
          >
            <div className="flex gap-2">
              <Image
                src={getIconPath('customers')}
                alt="Customers Icon"
                width={19}
                height={19}
              />
              Customers
            </div>

            <Image
              src="/icons/rightArrow.svg"
              alt="Right Arrow"
              width={19}
              height={19}
              className={`transition-transform ${openDropdown === 'customers' ? 'rotate-90' : ''}`}
            />
          </button>
          {openDropdown === 'customers' && (
            <ul className="pl-4">
              <li>
                <Link href="/admin/customers" className="block p-2 rounded transition-all hover:bg-white/90 hover:backdrop-blur-lg hover:shadow-sm">
                  Customers
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li className="mb-2">
          <button
            className="w-full text-left p-2 rounded flex justify-between items-center transition-all hover:bg-white/90 hover:backdrop-blur-lg hover:shadow-sm"
            onClick={() => toggleDropdown('content')}
          >
            <div className="flex gap-2">
              <Image
                src={getIconPath('files')}
                alt="Content Icon"
                width={19}
                height={19}
              />
              Content
            </div>

            <Image
              src="/icons/rightArrow.svg"
              alt="Right Arrow"
              width={19}
              height={19}
              className={`transition-transform ${openDropdown === 'content' ? 'rotate-90' : ''}`}
            />

          </button>
          {openDropdown === 'content' && (
            <ul className="pl-4">
              <li>
                <Link href="/admin/content" className="block p-2 rounded transition-all hover:bg-white/90 hover:backdrop-blur-lg hover:shadow-sm">
                  Content
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li className="mb-2">
          <button
            className="w-full text-left p-2 rounded flex justify-between items-center transition-all hover:bg-white/90 hover:backdrop-blur-lg hover:shadow-sm"
            onClick={() => toggleDropdown('analytics')}
          >
            <div className="flex gap-2">
              <Image
                src={getIconPath('charts')}
                alt="Analytics Icon"
                width={19}
                height={19}
              />
              Analytics
            </div>

            <Image
              src="/icons/rightArrow.svg"
              alt="Right Arrow"
              width={19}
              height={19}
              className={`transition-transform ${openDropdown === 'analytics' ? 'rotate-90' : ''}`}
            />

          </button>
          {openDropdown === 'analytics' && (
            <ul className="pl-4">
              <li>
                <Link href="/admin/analytics" className="block p-2 rounded transition-all hover:bg-white/90 hover:backdrop-blur-lg hover:shadow-sm">
                  Analytics
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li className="mb-2">
          <button
            className="w-full text-left p-2 rounded flex justify-between items-center transition-all hover:bg-white/90 hover:backdrop-blur-lg hover:shadow-sm"
            onClick={() => toggleDropdown('marketing')}
          >
            <div className="flex gap-2">
              <Image
                src={getIconPath('marketing')}
                alt="Marketing Icon"
                width={19}
                height={19}
              />
              Marketing
            </div>
            <Image
              src="/icons/rightArrow.svg"
              alt="Right Arrow"
              width={19}
              height={19}
              className={`transition-transform ${openDropdown === 'marketing' ? 'rotate-90' : ''}`}
            />
          </button>
          {openDropdown === 'marketing' && (
            <ul className="pl-4">
              <li>
                <Link href="/admin/marketing" className="block p-2 rounded transition-all hover:bg-white/90 hover:backdrop-blur-lg hover:shadow-sm">
                  Marketing
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li className="mb-2">
          <button
            className="w-full text-left p-2 rounded flex justify-between items-center transition-all hover:bg-white/90 hover:backdrop-blur-lg hover:shadow-sm"
            onClick={() => toggleDropdown('discounts')}
          >
            <div className="flex gap-2">
              <Image
                src={getIconPath('discounts')}
                alt="Discounts Icon"
                width={19}
                height={19}
              />
              Discounts
            </div>

            <Image
              src="/icons/rightArrow.svg"
              alt="Right Arrow"
              width={19}
              height={19}
              className={`transition-transform ${openDropdown === 'discounts' ? 'rotate-90' : ''}`}
            />

          </button>
          {openDropdown === 'discounts' && (
            <ul className="pl-4">
              <li>
                <Link href="/admin/discounts" className="block p-2 rounded transition-all hover:bg-white/90 hover:backdrop-blur-lg hover:shadow-sm">
                  Discounts
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li className="mb-2">
          <button
            className="w-full text-left p-2 rounded flex justify-between items-center transition-all hover:bg-white/90 hover:backdrop-blur-lg hover:shadow-sm"
            onClick={() => toggleDropdown('online-store')}
          >
            <div className="flex gap-2">
              <Image
                src={getIconPath('store')}
                alt="Online Store Icon"
                width={19}
                height={19}
              />
              Online Store
            </div>

            <Image
              src="/icons/rightArrow.svg"
              alt="Right Arrow"
              width={19}
              height={19}
              className={`transition-transform ${openDropdown === 'online-store' ? 'rotate-90' : ''}`}
            />

          </button>
          {openDropdown === 'online-store' && (
            <ul className="pl-4">
              <li>
                <Link href="/admin/online-store" className="block p-2 rounded transition-all hover:bg-white/90 hover:backdrop-blur-lg hover:shadow-sm">
                  Online Store
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;