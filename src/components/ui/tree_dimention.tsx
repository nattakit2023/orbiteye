import React from "react";
import {
	TreeItem as MuiTreeItem,
	TreeItemProps,
} from "@mui/x-tree-view/TreeItem";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

// Define the custom props we want to accept
interface CustomTreeItemProps extends TreeItemProps {
	link?: string;
}

const CustomTreeItem = React.forwardRef<HTMLLIElement, CustomTreeItemProps>(
	(props, ref) => {
		const { label, link, ...other } = props;

		/**
		 * This event handler is the key to making only the icon trigger the dropdown.
		 * It checks if the click happened on the icon container.
		 * If not, it prevents the default expansion/collapse behavior.
		 */
		const handleMouseDown = (event: React.MouseEvent) => {
			// Find the closest ancestor which is an icon container
			const iconContainer = (event.target as HTMLElement).closest(
				".MuiTreeItem-iconContainer",
			);

			if (!iconContainer) {
				event.preventDefault();
			}
		};

		return (
			<MuiTreeItem
				ref={ref}
				onMouseDown={handleMouseDown}
				label={
					<Box sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0 }}>
						{/* The label is now a clickable link for navigation */}
						<Link
							to={link || "#"}
							style={{ textDecoration: "none", color: "inherit" }}
						>
							<Typography variant="body2">{label}</Typography>
						</Link>
					</Box>
				}
				{...other}
			/>
		);
	},
);

export default CustomTreeItem;
