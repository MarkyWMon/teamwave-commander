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

  const isPitchAtStringer = fixture.pitch.name.toLowerCase().includes('stringer') || 
                           fixture.pitch.name.toLowerCase().includes('balfour') || 
                           fixture.pitch.name.toLowerCase().includes('varndean');

  const isStanleyDeason = fixture.pitch.name.toLowerCase().includes('stanley deason');

  return (
    <Html>
      <Head />
      <Preview>Match Details: {fixture.home_team.name} vs {fixture.away_team.name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={notice}>
            In the event of any issues impacting your fixture please communicate directly with your opposition manager - This email will NOT be monitored
          </Text>

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
              <strong>Kick-off Time:</strong> {new Date(fixture.match_date).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
              })}
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
            <Text style={subheading}>Referees:</Text>
            <Text style={text}>
              Referees have been requested for all fixtures but are as yet unconfirmed
            </Text>
          </Section>

          <Hr style={divider} />

          {isPitchAtStringer && (
            <Section style={detailsSection}>
              <Text style={subheading}>Dorothy Stringer/Balfour/Varndean Information:</Text>
              <Text style={text}>
                <strong>Parking:</strong> Parking for all of these pitches is at Dorothy Stringer School, Loder Road, BN1 6PL. 
                Follow the blue lines on the map to reach your designated pitch.
              </Text>
              <Text style={text}>
                <strong>Toilets:</strong> Toilet Access for all attendees to Stringer/Varndean/Balfour is in Dorothy Stringer 
                opposite the 3G entrance.
              </Text>
            </Section>
          )}

          {isStanleyDeason && (
            <Section style={detailsSection}>
              <Text style={subheading}>Stanley Deason 3G Information:</Text>
              <Text style={text}>
                This pitch is NOT at the Dorothy Stringer campus. The leisure centre is located at 120 Wilson Avenue, BN2 5BP.
              </Text>
              <Text style={text}>
                <strong>Parking:</strong> Parking will be obvious when you arrive at the centre.
              </Text>
              <Text style={text}>
                <strong>Toilets:</strong> Toilets can be found within the main leisure centre building.
              </Text>
              <Text style={subheading}>Strict Boot Policy:</Text>
              <Text style={text}>
                Stanley Deason 3G pitch has strict boot rules and centre staff will be doing a boot check before kick-off.
              </Text>
              <Text style={text}>
                <strong>Not Allowed:</strong>
                • Any Dirty Boots
                • Trainers
                • Old Style Blades
                • Astro Boots
              </Text>
              <Text style={text}>
                <strong>Allowed:</strong>
                • All Screw in Studs (including metal studs)
                • Modern Moulded Stud Football Boots
              </Text>
            </Section>
          )}

          {fixture.pitch.parking_info && (
            <Text style={text}>
              <strong>Additional Parking Information:</strong> {fixture.pitch.parking_info}
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

          <Hr style={divider} />

          <Text style={text}>
            Please confirm receipt by replying to this email and copying in the relevant {fixture.home_team.name} manager.
          </Text>

          <Text style={text}>
            Any issues: Managers please contact your opposition directly using the contact details supplied if you have any 
            issues that will impact your attendance (ideally by phone call or text message).
          </Text>

          <Text style={text}>
            Please Contact Managers Directly: Our Fixtures secretaries will not pick up on late messages so it is vital you 
            communicate directly with your opposition manager once you have been put in touch.
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