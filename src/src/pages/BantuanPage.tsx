import { PhoneIcon, MailIcon, UserIcon } from 'lucide-react';
export default function BantuanPage() {
  const contacts = [
  {
    role: 'Kepala Sekolah',
    name: 'Dr. H. Abdullah, M.Pd',
    phone: '+62 812-3456-7890',
    email: 'kepala.sekolah@sabilillah.sch.id'
  },
  {
    role: 'Wali Kelas X IPA 1',
    name: 'Ustadzah Fatimah, S.Pd',
    phone: '+62 813-4567-8901',
    email: 'fatimah@sabilillah.sch.id'
  },
  {
    role: 'Bagian Akademik',
    name: 'Ustadz Ahmad, S.Pd',
    phone: '+62 814-5678-9012',
    email: 'akademik@sabilillah.sch.id'
  },
  {
    role: 'Bagian Kesiswaan',
    name: 'Ustadzah Aisyah, S.Pd',
    phone: '+62 815-6789-0123',
    email: 'kesiswaan@sabilillah.sch.id'
  }];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bantuan</h1>
        <p className="text-gray-600">Kontak darurat sekolah</p>
      </div>

      <div className="space-y-4">
        {contacts.map((contact, index) =>
        <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#979DA5] rounded-xl flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 mb-1">{contact.role}</p>
                <h3 className="font-semibold text-gray-900 mb-3">
                  {contact.name}
                </h3>

                <div className="space-y-2">
                  <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-2 text-gray-700 hover:text-[#979DA5] transition-colors">

                    <PhoneIcon className="w-4 h-4" />
                    <span className="text-sm">{contact.phone}</span>
                  </a>
                  <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 text-gray-700 hover:text-[#979DA5] transition-colors">

                    <MailIcon className="w-4 h-4" />
                    <span className="text-sm">{contact.email}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Info */}
      <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-6">
        <h3 className="font-semibold text-red-900 mb-2">Kontak Darurat</h3>
        <p className="text-sm text-red-700 mb-3">
          Untuk keadaan darurat, hubungi:
        </p>
        <a
          href="tel:+628123456789"
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors">

          <PhoneIcon className="w-4 h-4" />
          +62 812-3456-789 (24 Jam)
        </a>
      </div>
    </div>);

}