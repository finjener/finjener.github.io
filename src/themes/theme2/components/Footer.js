
import React from 'react';
import { motion } from 'framer-motion';
import { getContent } from '../../../data';
import { useLanguage } from '../../../contexts/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();
    const [contactData, setContactData] = React.useState(null);

    React.useEffect(() => {
        const loadData = async () => {
            const data = await getContent();
            setContactData(data.contact);
        };
        loadData();
    }, []);

    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full py-8 mt-20 border-t border-[var(--t2-border)] bg-[var(--t2-background)]">
            <div className="container mx-auto px-6 max-w-4xl flex flex-col md:flex-row justify-between items-center gap-4">

                {/* Copyright */}
                <div className="text-sm text-[var(--t2-muted)] font-normal">
                    © All Rights Reserved.
                </div>

                {/* Social Links */}
                {contactData && contactData.socialLinks && contactData.socialLinks.platforms && (
                    <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 sm:gap-6">
                        {contactData.socialLinks.platforms.map((item, index) => (
                            <a
                                key={index}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--t2-muted)] hover:text-[var(--t2-foreground)] transition-colors duration-200 text-sm font-medium"
                                aria-label={item.name}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </footer>
    );
};

export default Footer;
