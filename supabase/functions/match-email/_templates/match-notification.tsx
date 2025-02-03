import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface MatchNotificationEmailProps {
  fixture: {
    match_date: string;
    kick_off_time: string;
    home_team: {
      name: string;
      team_color: string;
    };
    away_team: {
      name: string;
    };
    pitch: {
      name: string;
      address_line1: string;
      city: string;
      postal_code: string;
      latitude: number;
      longitude: number;
      parking_info: string;
      access_instructions: string;
      equipment_requirements: string;
      amenities: {
        toilets: boolean;
      };
    };
  };
}

export const MatchNotificationEmail = ({
  fixture,
}: MatchNotificationEmailProps) => {
  const mapLink = `https://www.google.com/maps?q=${fixture.pitch.latitude},${fixture.pitch.longitude}`;
  const formattedDate = new Date(fixture.match_date).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Html>
      <Head />
      <Preview>Match Details: {fixture.home_team.name} vs {fixture.away_team.name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={notice}>
            In the event of any issues impacting your fixture please communicate directly with your opposition manager - This email will NOT be monitored
          </Text>

          <Heading style={h1}>Match Details Confirmation</Heading>

          <Text style={text}>Dear Fixtures Secretary,</Text>

          <Text style={text}>
            Please find details of your upcoming fixture at {fixture.home_team.name}.
          </Text>

          <Section style={detailsSection}>
            <Text style={subheading}>Key Information:</Text>
            <Text style={text}>
              <strong>Date:</strong> {formattedDate}
            </Text>
            <Text style={text}>
              <strong>Kick-off Time:</strong> {fixture.kick_off_time}
            </Text>
            <Text style={text}>
              <strong>Venue:</strong> {fixture.pitch.name}
            </Text>
            <Text style={text}>
              <strong>Address:</strong> {fixture.pitch.address_line1}, {fixture.pitch.city}, {fixture.pitch.postal_code}
            </Text>
            <Link href={mapLink} style={mapLink}>
              View Location on Google Maps
            </Link>
          </Section>

          <Hr style={divider} />

          <Section style={detailsSection}>
            <Text style={subheading}>Home Team Colors:</Text>
            <Text style={text}>
              {fixture.home_team.name} play in {fixture.home_team.team_color}
            </Text>
          </Section>

          <Hr style={divider} />

          <Section style={detailsSection}>
            <Text style={subheading}>Important Notes:</Text>
            {fixture.pitch.parking_info && (
              <Text style={text}>
                <strong>Parking Information:</strong> {fixture.pitch.parking_info}
              </Text>
            )}
            {fixture.pitch.access_instructions && (
              <Text style={text}>
                <strong>Access Instructions:</strong> {fixture.pitch.access_instructions}
              </Text>
            )}
            {fixture.pitch.equipment_requirements && (
              <Text style={text}>
                <strong>Equipment Requirements:</strong> {fixture.pitch.equipment_requirements}
              </Text>
            )}
            {fixture.pitch.amenities?.toilets && (
              <Text style={text}>
                <strong>Toilets:</strong> Available on site
              </Text>
            )}
          </Section>

          <Hr style={divider} />

          <Text style={text}>
            Please confirm receipt by replying to this email and copying in the relevant {fixture.home_team.name} manager.
          </Text>

          <Text style={text}>
            We look forward to hosting you.
          </Text>

          <Text style={signature}>
            Many thanks,<br />
            {fixture.home_team.name}
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default MatchNotificationEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
};

const notice = {
  fontSize: '14px',
  color: '#e11d48',
  textAlign: 'center' as const,
  padding: '8px',
  backgroundColor: '#fff1f2',
  borderRadius: '4px',
  marginBottom: '24px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.25',
  marginBottom: '24px',
  textAlign: 'center' as const,
};

const text = {
  color: '#1a1a1a',
  fontSize: '14px',
  lineHeight: '24px',
  marginBottom: '12px',
};

const detailsSection = {
  margin: '16px 0',
};

const subheading = {
  ...text,
  fontSize: '16px',
  fontWeight: '600',
  marginBottom: '16px',
};

const mapLink = {
  color: '#2563eb',
  textDecoration: 'underline',
};

const divider = {
  margin: '20px 0',
  borderTop: '1px solid #e5e5e5',
};

const signature = {
  ...text,
  marginTop: '32px',
};