import { useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  List,
  ListItemButton,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
} from '@mui/material';
import type { ServiceAnalytics } from '@egov/shared';

const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function pct(score: number) {
  return `${Math.round(score * 100)}%`;
}

interface WardAnalyticsCardProps {
  data: ServiceAnalytics[];
}

export default function WardAnalyticsCard({ data }: WardAnalyticsCardProps) {
  const servicesByScore = useMemo(
    () => [...data].sort((a, b) => b.recurrence_score - a.recurrence_score),
    [data]
  );

  const [selectedServiceCode, setSelectedServiceCode] = useState(
    servicesByScore[0]?.serviceCode
  );

  const selectedService =
    servicesByScore.find((s) => s.serviceCode === selectedServiceCode) ??
    servicesByScore[0];

  const wardName = data[0]?.ward_name ?? 'Unknown Ward';
  const topService = servicesByScore[0];

  const yearsObserved = useMemo(() => {
    const years = new Set<number>();
    data.forEach((s) => s.years_observed.forEach((y) => years.add(y)));
    return Array.from(years).sort((a, b) => a - b);
  }, [data]);

  const recurringMonths = useMemo(
    () =>
      [...(selectedService?.recurring_months ?? [])].sort(
        (a, b) => b.recurrence_score - a.recurrence_score
      ),
    [selectedService]
  );

  const monthlyYears = useMemo(
    () =>
      Object.keys(selectedService?.monthly_counts ?? {}).sort(
        (a, b) => Number(a) - Number(b)
      ),
    [selectedService]
  );

  if (!topService) return null;

  return (
    <Box sx={{ mt: 2 }}>
      {/* Header */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{justifyContent:"space-between", alignItems: {sm: 'flex-start'}}}
          spacing={2}
        >
          <Box>
            <Typography variant="h6">{wardName}</Typography>
            {topService.is_hotspot && (
              <Chip
                label="Hotspot"
                color="error"
                size="small"
                sx={{ mt: 0.5 }}
              />
            )}
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Overall Recurrence Score
            </Typography>
            <Typography variant="h6" color="primary">
              {pct(topService.recurrence_score)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
              Observed Years
            </Typography>
            <Stack direction="row" sx={{ mt: 0.5 , flexWrap:"wrap", gap: 0.5}}>
              {yearsObserved.map((y) => (
                <Chip key={y} label={y} size="small" variant="outlined" />
              ))}
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* Services + Recurring months */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <Paper variant="outlined" sx={{ flex: 1, p: 1 }}>
          <Typography variant="subtitle2" sx={{ px: 1, pt: 1 }}>
            Recurring Services in this Ward
          </Typography>
          <List dense>
            {servicesByScore.map((service) => (
              <ListItemButton
                key={service.serviceCode}
                selected={service.serviceCode === selectedServiceCode}
                onClick={() => setSelectedServiceCode(service.serviceCode)}
              >
                <ListItemText primary={service.serviceCode} />
                <Typography variant="body2" color="text.secondary">
                  {pct(service.recurrence_score)}
                </Typography>
              </ListItemButton>
            ))}
          </List>
        </Paper>

        <Paper variant="outlined" sx={{ flex: 1, p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Recurring Months for {selectedService.serviceCode}
          </Typography>
          <Stack spacing={1}>
            {recurringMonths.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No recurring months for this service.
              </Typography>
            )}
            {recurringMonths.map((m) => (
              <Stack
                key={m.month}
                direction="row"
                sx={{alignItems: "center"}}
                spacing={1}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: m.is_hotspot ? 'error.main' : 'primary.main',
                    flexShrink: 0,
                  }}
                />
                <Typography variant="body2" sx={{ minWidth: 90 }}>
                  {m.month_name}
                </Typography>
                {m.is_hotspot && (
                  <Chip label="Hotspot" color="error" size="small" />
                )}
                <Typography variant="caption" color="text.secondary">
                  Observed in: {m.years.join(', ')}
                </Typography>
              </Stack>
            ))}
          </Stack>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 2 }}
          >
            Months marked as hotspot are those that repeat across multiple
            years.
          </Typography>
        </Paper>
      </Stack>

      {/* Monthly history table */}
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Monthly Complaint History (Counts) for {selectedService.serviceCode}
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Year</TableCell>
                {MONTH_LABELS.map((m) => (
                  <TableCell key={m} align="center">
                    {m}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {monthlyYears.map((year) => (
                <TableRow key={year}>
                  <TableCell>{year}</TableCell>
                  {selectedService.monthly_counts[year].map((count, idx) => (
                    <TableCell key={idx} align="center">
                      {count}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 1 }}
        >
          Showing counts of complaints received in each month of the year.
        </Typography>
      </Paper>
    </Box>
  );
}