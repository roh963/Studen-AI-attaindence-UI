import Card from '../components/Card.jsx'

const cards = [
  {
    name: 'Student',
    description: 'Access your courses, assignments, attendance, and results all in one place.',
    buttonName: 'Student Portal',
    redirectTo: '/student-login',
    icon: '🎓',
    accentColor: '#8494FF',
  },
  {
    name: 'Faculty',
    description: 'Manage your classes, upload materials, and track student progress effortlessly.',
    buttonName: 'Faculty Portal',
    redirectTo: '/faculty-login',
    icon: '🏛️',
    accentColor: '#8494FF',
  },
]

export default function Home() {
  return (
    <div
      className="bg-page min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20"
    >
      {/* Badge */}
      <div
        className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
        style={{
          background: 'rgba(132,148,255,0.12)',
          color: '#6b5fe0',
          border: '1.5px solid rgba(132,148,255,0.3)',
        }}
      >
        Welcome to Academic Portal
      </div>

      {/* Heading */}
      <div className="text-center mb-12">
        <h1
          className="font-sekuya text-5xl sm:text-6xl font-black leading-tight mb-4"
          style={{ color: '#2d2060' }}
        >
          Who are{' '}
          <span style={{ color: '#8494FF' }}>you?</span>
        </h1>
        <p
          className="text-sm max-w-sm mx-auto leading-relaxed"
          style={{ color: 'rgba(45,32,96,0.6)' }}
        >
          Select your role to continue to your personalized portal experience.
        </p>
      </div>

      {/* Cards */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '24px',
          justifyContent: 'center',
          alignItems: 'stretch',
          width: '100%',
          maxWidth: '700px',
        }}
      >
        {cards.map((card) => (
          <Card key={card.name} {...card} />
        ))}
      </div>
    </div>
  )
}