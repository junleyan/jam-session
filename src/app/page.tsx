/* eslint-disable @typescript-eslint/no-shadow */
import { PrismaClient } from '@prisma/client';
import { Col, Container, Row, Button } from 'react-bootstrap';
import FeaturedSessionCard from '../components/FeaturedSessionCard';

const prisma = new PrismaClient();

interface SessionType {
  id: number;
  location: string;
  time: Date; // Use Date because Prisma returns `Date` objects for date/time fields
  musicalType: string;
  desiredCapabilities: string;
  organizerContact: string;
  owner: string;
}

export const getFeaturedSession = async (): Promise<Omit<SessionType, 'time'> & { time: string } | null> => {
  const sessions = await prisma.session.findMany({
    select: {
      id: true,
      location: true,
      time: true,
      musicalType: true,
      desiredCapabilities: true,
      organizerContact: true,
      owner: true,
    },
  });

  const now = new Date();

  const closestSession = sessions.reduce<SessionType | null>((closest, session) => {
    const sessionDate = new Date(session.time);
    const closestDate = closest ? new Date(closest.time) : null;

    return sessionDate > now && (!closestDate || sessionDate < closestDate)
      ? session
      : closest;
  }, null);

  if (closestSession) {
    return {
      ...closestSession,
      time: closestSession.time.toISOString(),
    };
  }

  return null;
};

const LandingPage = async () => {
  const featuredSession = await getFeaturedSession();

  return (
    <main>
      {/* Hello Section */}
      <section
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          color: 'white',
          padding: '50px 0',
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col
              xs={12}
              md={5}
              className="text-center p-4"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                borderRadius: '10px',
              }}
            >
              <h1 className="mb-4">HELLO THERE!</h1>
              <p>Welcome to Jam Session!</p>
              <div className="d-flex justify-content-between align-items-center">
                <Button
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    border: '1px solid white',
                    color: 'white',
                    margin: '10px',
                    width: '48%', // Adjust for left-right alignment
                    height: '60px', // Set a consistent height
                  }}
                  href="/auth/signin" // Redirects to login
                >
                  Log Into an Existing Account
                </Button>
                <Button
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    border: '1px solid white',
                    color: 'white',
                    margin: '10px',
                    width: '48%', // Adjust for left-right alignment
                    height: '60px', // Set a consistent height
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center', // Vertically align text
                    textAlign: 'center',
                  }}
                  href="/auth/signup" // Redirects to sign up
                >
                  Create a New Account
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Session Section */}
      <section
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          color: 'white',
          padding: '0 0 20px',
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col
              xs={12}
              md={10}
              className="p-4"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                borderRadius: '10px',
              }}
            >
              <h2 className="text-center mb-4">🎤 Featured Session 🎶</h2>
              {featuredSession ? (
                <FeaturedSessionCard session={featuredSession} />
              ) : (
                <p className="text-center text-white">
                  No upcoming sessions available.
                </p>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default LandingPage;
